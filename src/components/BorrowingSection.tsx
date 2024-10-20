import React, { useState } from 'react';
import { PiggyBank } from 'lucide-react';
import { ethers } from 'ethers';

interface BorrowingSectionProps {
  contract: ethers.Contract | null;
  signer: ethers.Signer | null;
}

const BorrowingSection: React.FC<BorrowingSectionProps> = ({ contract, signer }) => {
  const [borrowAmount, setBorrowAmount] = useState('');

  const handleBorrow = async () => {
    if (!contract || !signer) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const amount = ethers.utils.parseEther(borrowAmount);
      const tx = await contract.borrow(amount);
      await tx.wait();
      alert("Borrowing successful!");
      setBorrowAmount('');
    } catch (error) {
      console.error("Error borrowing:", error);
      alert("Failed to borrow. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <PiggyBank className="mr-2 text-blue-500" />
        Borrow from Pool
      </h2>
      <div className="mb-4">
        <label htmlFor="borrow-amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount (in ETH)
        </label>
        <input
          type="number"
          id="borrow-amount"
          value={borrowAmount}
          onChange={(e) => setBorrowAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.5"
          min="0"
          step="0.01"
        />
      </div>
      <button
        onClick={handleBorrow}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
      >
        Request Loan
      </button>
    </div>
  );
};

export default BorrowingSection;