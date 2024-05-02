import { useState, useEffect } from 'react';
import { UserStats } from './type';

interface UserStatsComponentProps {
    usernames: string[];
}

function UserStatsComponent({ usernames }: UserStatsComponentProps): JSX.Element {
    const [userStatsList, setUserStatsList] = useState<UserStats[]>([]);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                // Fetch user stats for each username
                const promises = usernames.map(async (username) => {
                    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch data for user: ${username}`);
                    }
                    return response.json();
                });
                const userStatsData = await Promise.all(promises);
                setUserStatsList(userStatsData);
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        fetchUserStats();
    }, [usernames]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Username</th>
                        <th className="border border-gray-300 px-4 py-2">Easy Solved</th>
                        <th className="border border-gray-300 px-4 py-2">Medium Solved</th>
                        <th className="border border-gray-300 px-4 py-2">Hard Solved</th>
                    </tr>
                </thead>
                <tbody>
                    {userStatsList.map((userStats, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} style={{ opacity: 0.8 }}>
                            <td className="border border-gray-300 px-4 py-2">{usernames[index]}</td>
                            <td className="border border-gray-300 px-4 py-2">{userStats.easySolved}</td>
                            <td className="border border-gray-300 px-4 py-2">{userStats.mediumSolved}</td>
                            <td className="border border-gray-300 px-4 py-2">{userStats.hardSolved}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserStatsComponent;
