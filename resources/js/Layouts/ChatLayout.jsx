import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversations;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const isUserOnline = (userId) => onlineUsers[userId];

    console.log('conversations', conversations);
    console.log('selectedConversation', selectedConversation);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? -1 : 1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }
                if(a.last_message_date  && b.last_message_date) {
                    return b.last_message_date.localCompare(
                        a.last_message_date
                    )
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        )
    }, [conversations])

    useEffect(() => {
        setLocalConversations(conversations);
    },[localConversations])

    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                const onlineUsersObject = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setOnlineUsers((previousOnlineUsers) => {
                    return { ...previousOnlineUsers, ...onlineUsersObject };
                });
            })
            .joining((user) => {
                setOnlineUsers((previousOnlineUsers) => {
                    const updatedUsers = { ...previousOnlineUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((previousOnlineUsers) => {
                    const updatedUsers = { ...previousOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            });

        return () => {
            Echo.leave('online');
        }

    }, []);

    return (
        <div>
            Chat Layout

        </div>
    )
}

export default ChatLayout
