import React, { useState } from 'react';

interface ChatInputProps {
    onSendMessage: (content: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim() && !sending) {
            const messageToSend = message;
            setMessage(''); // Clear input immediately for better UX
            setSending(true);
            try {
                await onSendMessage(messageToSend);
                // No need to clear message again as we did it above
            } catch (error) {
                // If sending fails, restore the message
                setMessage(messageToSend);
                console.error('Failed to send message:', error);
            } finally {
                setSending(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
            <div className="flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className=" text-black flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                    {sending ? 'Sending...' : 'Send'}
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
