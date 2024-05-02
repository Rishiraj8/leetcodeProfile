import { useState, useEffect } from 'react';
import UserStatsComponent from './Components/UserStatsComponent';

function App(): JSX.Element {
    const [usernames, setUsernames] = useState<string[]>([]);
    const [newUsername, setNewUsername] = useState<string>('');

    useEffect(() => {
        // Fetch the initial usernames from the API
        fetchUsernames();
    }, []); // Empty dependency array to execute the effect only once on component mount

    const fetchUsernames = () => {
        // Fetch the usernames from the API
        fetch('https://leetcodeapi-s.penneithendral.workers.dev/users')
            .then(response => response.json())
            .then(data => {
                // Extract the usernames from the API response
                const user_ids = data.queryResult.results;
                const fetchedUsernames = user_ids.map((user: { user_id: string }) => user.user_id);
                
                // Set the fetched usernames to the state
                setUsernames(fetchedUsernames);
            })
            .catch(error => console.error('Error fetching usernames:', error));
    };

    const handleAddUser = async () => {
        try {
            // Send a POST request to add the new username to the database
            const response = await fetch(`https://leetcodeapi-s.penneithendral.workers.dev/users/${newUsername}`, {
                method: 'POST'
            });

            if (response.ok) {
                // If the request is successful, fetch the updated usernames from the API
                fetchUsernames();
            } else {
                throw new Error('Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
        } finally {
            // Clear the input field
            setNewUsername('');
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <div className="flex flex-row justify-center gap-5 items-center mb-4">
                <input
                    className="border border-gray-300 rounded px-4 py-2 mb-2 w-full sm:w-1/2 lg:w-1/3"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                />
                <button
                    className="bg-gray-100 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded w-full sm:w-auto"
                    onClick={handleAddUser}
                >
                    Add
                </button>
            </div>
            <UserStatsComponent usernames={usernames} />
        </div>
    );
}

export default App;
