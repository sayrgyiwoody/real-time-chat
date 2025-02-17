import React, { useEffect } from 'react'

const ChatLayout = ({ children }) => {

    const [onlineUsers, setOnlineUsers] = React.useState([]);

    const isUserOnline = (userId) => onlineUsers[userId];


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
            {onlineUsers && Object.keys(onlineUsers).map((userId) => (
                <div key={userId}>
                    {onlineUsers[userId].name}
                </div>
            ))}
            {children}
        </div>
    )
}

export default ChatLayout
