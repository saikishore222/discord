"use client";

import React, { useState, useEffect } from 'react';
import { getProfile, transcations } from '../firebase';
import Link from 'next/link'; // Import Link from next/link

const Profile = () => {
    const [copied, setCopied] = useState(false);
    const [profileData, setProfileData] = useState(null); // Initialize profileData as null
    const [transactionsData, setTransactionsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await getProfile();
                const transactions = await transcations();
                console.log('Profile data:', profile);
                console.log('Transaction data:', transactions);
                setProfileData(profile);
                setTransactionsData(transactions);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        if (!profileData) { // Check if profileData is null
            fetchData();
        }
    }, [profileData]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileData.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatFirestoreTimestamp = (timestamp) => {
        const seconds = timestamp._seconds;
        const nanoseconds = timestamp._nanoseconds;
        const milliseconds = seconds * 1000 + Math.round(nanoseconds / 1000000);
        const date = new Date(milliseconds);
        return date.toLocaleString();
    };

    if (loading || !profileData) { // Display loading widget if loading or profileData is null
        return <p className='mt-20 ml-96'>Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <div className="flex items-center space-x-4 mb-8">
                <div className="w-36 h-36 rounded-full overflow-hidden">
                    <img src={profileData.photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h2 className="text-3xl font-semibold">{profileData.name}</h2>
                    <p className="text-gray-500">{profileData.email}</p>
                    <p className="text-gray-500">{profileData.wallet}</p>
                    <p className="text-gray-500">{profileData.amount} SOL</p>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Transactions</h3>
            <div className="">
                <table className="min-w-full border-collapse border border-gray-300 mb-10">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prompt</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transactionsData.map((transaction, index) => (
                            <tr key={index} className={`${transaction.type === 'receive' ? 'bg-green-50' : 'bg-red-50'}`}>
                                <td className="px-6 py-4 whitespace-nowrap">{transaction.type === 'receive' ? 'Debit' : 'Credit'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{transaction.amount || '0.001'} Sol</td>
                                <td className="px-6 py-4 whitespace-nowrap">{transaction.prompt}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatFirestoreTimestamp(transaction.time)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link
                                        href={`https://solana.fm/tx/${transaction.sig}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Locate in Explorer
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Profile;
