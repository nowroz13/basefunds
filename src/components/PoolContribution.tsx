import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { ethers } from 'ethers';

interface PoolContributionProps {
  contract: ethers.Contract | null;
  signer: ethers.Signer | null;
}

const PoolContribution: React.FC<PoolContributionProps> = ({ contract, signer }) => {
  const [contributionAmount, setContributionAmount] = useState('');

  const handleContribute = async () => {
    if (!contract || !signer) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const amount = ethers.utils.parseEther(contributionAmount);
      const tx = await contract.contribute({ value: amount });
      await tx.wait();
      alert("Contribution successful!");
      setContributionAmount('');
    } catch (error) {
      console.error("Error contributing:", error);
      alert("Failed to contribute. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <DollarSign className="mr-2 text-green-500" />
        Contribute to Pool
      </h2>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount (in ETH)
        </label>
        <input
          type="number"
          id="amount"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.1"
          min="0"
          step="0.01"
        />
      </div>
      <button
        onClick={handleContribute}
        className="w-full bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition duration-300"
      >
        Contribute
      </button>
    </div>
  );
};

export default PoolContribution;