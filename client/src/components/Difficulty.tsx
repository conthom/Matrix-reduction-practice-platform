import React, { useState } from 'react';
import Image from 'next/image';
interface ResponseData {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    setResponse: (response: { matrix: number[][] }) => void;
}

export default function Difficulty({
    isLoading,
    setIsLoading,
    setResponse,
}: ResponseData) {
    // process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Environment variables
    const apiUrl = '/api';

    const [difficulty, setLocalDifficulty] = useState("easy");
    const [localLoading, setLocalLoading] = useState(false); // Local loading state for immediate feedback

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDifficulty = event.target.value;
        setLocalDifficulty(newDifficulty);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setResponse({ matrix: [] }); // Clear previous matrix
        setIsLoading(true);
        setLocalLoading(true); // Set local loading state immediately

        try {
            console.log("Fetching matrix with difficulty:", difficulty);
            console.log("Loading state set to:", true);
            
            // Fetch the matrix from the backend
            const response = await fetch(
                `${apiUrl}/get_matrix?difficulty=${difficulty}`,
                {
                    method: 'GET',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch matrix');
            }

            const data = await response.json();

            // Log the fetched matrix and handle empty matrix response
            console.log("Fetched matrix response:", data);
            if (!data.matrix || data.matrix.length === 0) {
                console.warn("Matrix is empty or undefined:", data);
            }

            // Set the received matrix in state
            setResponse(data);
        } 
        catch (error) {
            console.error("Error fetching matrix:", error);
        }
        finally {
            setIsLoading(false);
            setLocalLoading(false);
            console.log("Loading state set to:", false);
        }
    };

    // Use either the prop loading state or local loading state
    const showLoading = isLoading || localLoading;

    return (
        <div className="max-w-lg w-full bg-gray-800 rounded-lg shadow-md p-6">
            {showLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-lg text-center font-bold text-white">Generating your {difficulty} matrix...</p>
                    <p className="text-sm text-gray-400 mt-2">This may take a moment to start the server.</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-center items-center h-full">
                        <Image src="/rref thing (1).png" alt="Image showing row reduced form of a matrix" className="object-contain" width={500} height={500} />
                    </div>   
                    <div className="flex justify-center mt-4 text-lg font-bold">
                        <h2>Ready to practice matrix reduction?</h2>
                    </div>
                    <div className="flex justify-center mt-4">
                        <p>Try to set a new speed record!</p>
                    </div>
                    <div className="flex justify-center mt-4">
                        <p>Select a difficulty below:</p>
                    </div>
                    <div className="flex justify-center mt-4">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input 
                                    className="hover:cursor-pointer"
                                    type="radio"
                                    id="easy"
                                    name="difficulty"
                                    value="easy"
                                    checked={difficulty === "easy"}
                                    onChange={handleDifficultyChange}
                                />
                                <label className="hover:cursor-pointer" htmlFor="easy" style={{ color: 'lightgreen' }}> Easy</label>
                            </div>
                            <div>
                                <input
                                    className="hover:cursor-pointer"
                                    type="radio"
                                    id="medium"
                                    name="difficulty"
                                    value="medium"
                                    checked={difficulty === "medium"}
                                    onChange={handleDifficultyChange}
                                />
                                <label className="hover:cursor-pointer" htmlFor="medium" style={{ color: 'orange' }}> Medium</label>
                            </div>
                            <div>
                                <input
                                    className="hover:cursor-pointer"
                                    type="radio"
                                    id="hard"
                                    name="difficulty"
                                    value="hard"
                                    checked={difficulty === "hard"}
                                    onChange={handleDifficultyChange}
                                />
                                <label className="hover:cursor-pointer" htmlFor="hard" style={{ color: 'red' }}> Hard</label>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button
                                    className={`${showLoading ? 'bg-gray-600' : 'bg-gray-900 hover:bg-gray-500'} rounded-lg shadow-md text-xl py-2 px-4 transition-colors`}
                                    type="submit"
                                    disabled={showLoading}
                                    >
                                    {showLoading ? "Loading..." : "Begin"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
