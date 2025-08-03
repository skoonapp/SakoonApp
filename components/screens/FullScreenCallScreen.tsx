import React, { useState, useEffect, useRef } from 'react';
import { ActiveCall, User } from '../../types';
import { ZEGO_APP_ID } from '../../constants';

// ZegoExpressEngine is loaded from a script tag in index.html.
// We declare it on the window object for type safety and to avoid ReferenceError.
declare global {
    interface Window {
        ZegoExpressEngine: any;
    }
}

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

interface CallControlButtonProps {
    onClick: () => void;
    label: string;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}

const CallControlButton: React.FC<CallControlButtonProps> = ({ onClick, label, isActive = false, disabled = false, children, className = '' }) => (
    <div className="flex flex-col items-center gap-2 w-20">
        <button
            onClick={onClick}
            aria-label={label}
            disabled={disabled}
            className={`w-16 h-16 flex items-center justify-center rounded-full transition-all shadow-md active:scale-90 ${isActive ? 'bg-white text-gray-800' : 'bg-white/20 text-white'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
        <span className="text-xs text-white/80">{label}</span>
    </div>
);


interface FullScreenCallScreenProps {
    call: ActiveCall;
    onEndCall: (call: ActiveCall) => void;
    onBack: () => void;
    user: User | null;
}

const FullScreenCallScreen: React.FC<FullScreenCallScreenProps> = ({ call, onEndCall, onBack, user }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isLoudspeaker, setIsLoudspeaker] = useState(false);
    const [status, setStatus] = useState('Initializing...');

    const zegoInstanceRef = useRef<any>(null);
    const localStreamRef = useRef<any>(null);
    const localStreamIDRef = useRef<string>(''); // Ref for the local stream ID
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const remoteStreamIDRef = useRef<string | null>(null);

    useEffect(() => {
        let zg: any = null;
        const roomID = `sakoon-call-${call.id}`;
        
        const cleanup = () => {
            if (zegoInstanceRef.current) {
                if (localStreamRef.current) {
                    zegoInstanceRef.current.stopPublishingStream(localStreamIDRef.current);
                    zegoInstanceRef.current.destroyStream(localStreamRef.current);
                    localStreamRef.current = null;
                }
                if (remoteStreamIDRef.current) {
                    zegoInstanceRef.current.stopPlayingStream(remoteStreamIDRef.current);
                    remoteStreamIDRef.current = null;
                }
                zegoInstanceRef.current.logoutRoom(roomID);
                zegoInstanceRef.current = null;
            }
        };

        const initZego = async () => {
            const ZegoEngine = window.ZegoExpressEngine;
            if (!user || !ZegoEngine) {
                setStatus('Error: SDK or user missing');
                console.error("ZegoExpressEngine not found or user is not defined.", { hasSdk: !!ZegoEngine, hasUser: !!user });
                return;
            }

            localStreamIDRef.current = `stream-${roomID}-${user.id}`;
            zg = new ZegoEngine(ZEGO_APP_ID, 'wss://webliveroom' + ZEGO_APP_ID + '-api.zego.im/ws');
            zegoInstanceRef.current = zg;
            
            zg.on('roomStateUpdate', async (currentRoomID: string, state: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING') => {
                 if (currentRoomID !== roomID) return;
                 if (state === 'CONNECTED') {
                    setStatus('Connected. Starting audio...');
                    try {
                        const stream = await zg.createStream({ camera: { video: false, audio: true } });
                        localStreamRef.current = stream;
                        zg.startPublishingStream(localStreamIDRef.current, stream);
                    } catch (err) {
                        console.error('Error creating stream:', err);
                        setStatus('Mic permission denied.');
                        alert('Could not start microphone. Please check permissions and refresh.');
                    }
                } else if (state === 'DISCONNECTED') {
                    setStatus('Disconnected');
                } else if (state === 'CONNECTING') {
                    setStatus('Connecting...');
                }
            });

            zg.on('publisherStateUpdate', (result: { state: 'PUBLISHING' | 'NO_PUBLISH' }) => {
                if (result.state === 'PUBLISHING') {
                    setStatus('Waiting for user...');
                } else if (result.state === 'NO_PUBLISH') {
                    setStatus('Stream stopped');
                }
            });

            zg.on('roomStreamUpdate', async (currentRoomID: string, updateType: 'ADD' | 'DELETE', streamList: any[]) => {
                if (currentRoomID !== roomID) return;
                if (updateType === 'ADD') {
                    remoteStreamIDRef.current = streamList[0].streamID;
                    setStatus('User joined. Connecting audio...');
                    try {
                        // The SDK will handle playing this on the correct output device.
                        // We use the hidden audio element as the sink.
                        await zg.startPlayingStream(remoteStreamIDRef.current, remoteAudioRef.current);
                        setStatus('Live');
                    } catch (error) {
                       console.error('Error playing stream:', error);
                       setStatus('Error playing user stream.');
                    }
                } else if (updateType === 'DELETE') {
                    onEndCall(call);
                }
            });

            try {
                // Token is empty for testing. In production, generate from a server.
                await zg.loginRoom(roomID, '', { userID: user.id, userName: user.name });
            } catch (err) {
                 console.error('Room login failed:', err);
                 setStatus('Failed to connect to call.');
            }
        };

        const sdkPoll = setInterval(() => {
            if (window.ZegoExpressEngine) {
                clearInterval(sdkPoll);
                initZego();
            }
        }, 200);

        const sdkTimeout = setTimeout(() => {
            clearInterval(sdkPoll);
            if (!window.ZegoExpressEngine) {
                console.error("ZegoExpressEngine SDK failed to load in time.");
                setStatus('Error: SDK load timeout');
            }
        }, 10000);

        return () => {
            clearTimeout(sdkTimeout);
            clearInterval(sdkPoll);
            cleanup();
        };

    }, [call.id, user, onEndCall]);

    const handleToggleMute = () => {
        const zg = zegoInstanceRef.current;
        if (zg && localStreamIDRef.current) {
            const newMutedState = !isMuted;
            try {
                zg.mutePublishStreamAudio(localStreamIDRef.current, newMutedState);
                // Only update state if the SDK call succeeds without throwing an error
                setIsMuted(newMutedState);
            } catch (error) {
                console.error("SDK error on toggle mute:", error);
                setStatus("Mute Failed");
            }
        } else {
            console.warn("Mute toggle failed: Zego instance or local stream not ready.");
        }
    };

    const handleToggleSpeaker = () => {
        const zg = zegoInstanceRef.current;
        if (!zg) {
            alert('SDK is not ready to toggle speaker.');
            return;
        }
    
        const newSpeakerState = !isLoudspeaker;
        try {
            zg.enableSpeaker(newSpeakerState);
            // Only update state if the SDK call succeeds without throwing an error
            setIsLoudspeaker(newSpeakerState);
        } catch (error) {
            console.error("Error toggling speaker:", error);
            setStatus("Speaker error");
            alert('An error occurred while switching the speaker.');
        }
    };
    
    // Disable controls until the call is in a state where they are usable.
    const isMuteButtonDisabled = !['Waiting for user...', 'Live'].includes(status);
    const isSpeakerButtonDisabled = status !== 'Live';

    return (
        <div className="fixed inset-0 max-w-md mx-auto flex flex-col bg-gradient-to-br from-[#0d123a] to-[#0a0f2c] text-white z-50">
            {/* Hidden audio element for remote stream */}
            <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />

            {/* UI overlay */}
            <div className="flex flex-col h-full">
                <header className="p-4 flex items-center shrink-0">
                   <button onClick={onBack} className="p-2 -ml-2" aria-label="Back to call list">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                       </svg>
                    </button>
                    <h2 className="text-xl font-bold mx-auto drop-shadow-md">Voice Call</h2>
                    <div className="w-10"></div>
                </header>

                <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
                     <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center font-bold text-7xl text-white shadow-2xl mb-6 animate-glow-green">
                        {call.avatar}
                    </div>
                    <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">{call.name}</h3>
                    <p className="text-lg font-mono text-white/90 drop-shadow-md mb-4">
                        {status === 'Live' ? formatTime(call.timeRemaining) : status}
                    </p>
                </main>

                <footer className="p-6 shrink-0 mt-auto">
                    <div className="flex justify-evenly items-center w-full">
                        <CallControlButton onClick={handleToggleMute} label={isMuted ? 'Unmute' : 'Mute'} isActive={isMuted} disabled={isMuteButtonDisabled}>
                             {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.64.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                                </svg>
                             ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5a6 6 0 006 6zM12 18.75a6 6 0 00-6-6v-1.5a6 6 0 006-6v-1.5a6 6 0 006 6v1.5a6 6 0 00-6 6z" />
                                </svg>
                             )}
                        </CallControlButton>
                       
                        <button 
                            onClick={() => onEndCall(call)}
                            aria-label="End call"
                            className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-all shadow-lg transform active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white transform rotate-[135deg]" viewBox="0 0 20 20" fill="currentColor">
                               <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </button>

                        <CallControlButton onClick={handleToggleSpeaker} label={isLoudspeaker ? 'Earpiece' : 'Speaker'} isActive={isLoudspeaker} disabled={isSpeakerButtonDisabled}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        </CallControlButton>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default FullScreenCallScreen;