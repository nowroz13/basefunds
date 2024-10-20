import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import ConnectWallet from './components/ConnectWallet';
import PoolContribution from './components/PoolContribution';
import BorrowingSection from './components/BorrowingSection';
import PoolStatus from './components/PoolStatus';
const contractAddress = '0x3DB1153Fd39eAB17FA884152CdE5d5BaF92e34A2';
const contractABI = [
  "function contribute() external payable",
  "function borrow(uint amount) external",
  "function getPoolBalance() external view returns (uint)",
  "function contributions(address) external view returns (uint)",
  "function totalContributions() external view returns (uint)",
];

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setIsWalletConnected(false);
      setContract(null);
      setSigner(null);
    } else {
      connectWallet();
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setIsWalletConnected(true);
        setContract(contract);
        setSigner(signer);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install coinbase wallet!");
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setContract(null);
    setSigner(null);
  };

  return (
    <div className="min-h-screen bg-orange-500">
      <Header 
        isWalletConnected={isWalletConnected} 
        connectWallet={connectWallet} 
        disconnectWallet={disconnectWallet}
      />
      <main className="container mx-auto px-4 py-8">
        {!isWalletConnected ? (
          <ConnectWallet onConnect={connectWallet} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PoolContribution contract={contract} signer={signer} />
            <BorrowingSection contract={contract} signer={signer} />
            <PoolStatus contract={contract} signer={signer} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
