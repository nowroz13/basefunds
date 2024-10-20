import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { ethers } from 'ethers';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PoolStatusProps {
  contract: ethers.Contract | null;
  signer: ethers.Signer | null;
}

const PoolStatus: React.FC<PoolStatusProps> = ({ contract, signer }) => {
  const [poolData, setPoolData] = useState({
    totalContributions: '0',
    poolBalance: '0',
    userContribution: '0',
    totalBorrowed: '0', // Add borrowed data
  });

  useEffect(() => {
    const fetchPoolData = async () => {
      if (contract && signer) {
        try {
          const totalContributions = await contract.totalContributions();
          const poolBalance = await contract.getPoolBalance();
          const address = await signer.getAddress();
          const userContribution = await contract.contributions(address);

          // Calculate borrowed amount
          const borrowedAmount = totalContributions.sub(poolBalance);

          setPoolData({
            totalContributions: ethers.utils.formatEther(totalContributions),
            poolBalance: ethers.utils.formatEther(poolBalance),
            userContribution: ethers.utils.formatEther(userContribution),
            totalBorrowed: ethers.utils.formatEther(borrowedAmount), // Set borrowed amount
          });
        } catch (error) {
          console.error("Error fetching pool data:", error);
        }
      }
    };

    fetchPoolData();
    const interval = setInterval(fetchPoolData, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [contract, signer]);

  // Data for Pie chart
  const pieData = {
    labels: ['Total Contributions', 'Pool Balance', 'Your Contribution', 'Borrowed Amount'], // Add borrowed label
    datasets: [
      {
        data: [
          parseFloat(poolData.totalContributions),
          parseFloat(poolData.poolBalance),
          parseFloat(poolData.userContribution),
          parseFloat(poolData.totalBorrowed), // Include borrowed amount
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Add color for borrowed amount
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Users className="mr-2 text-purple-500" />
        Pool Status
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Normal status display */}
        <div>
          <p className="text-sm text-gray-600">Total Contributions</p>
          <p className="text-lg font-semibold">{poolData.totalContributions} ETH</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Pool Balance</p>
          <p className="text-lg font-semibold">{poolData.poolBalance} ETH</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Your Contribution</p>
          <p className="text-lg font-semibold">{poolData.userContribution} ETH</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Borrowed Amount</p>
          <p className="text-lg font-semibold">{poolData.totalBorrowed} ETH</p> {/* Display borrowed amount */}
        </div>
        
        {/* Pie chart display */}
        <div className="col-span-full mt-6">
          <div className="aspect-square w-full max-w-[300px] mx-auto">
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolStatus;
