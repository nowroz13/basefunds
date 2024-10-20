import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { ethers } from 'ethers';
import '../index.css';

interface ConnectWalletProps {
  onConnect: (signer: ethers.Signer) => void;
  onDisconnect: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect, onDisconnect }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      setLoading(true);
      try {
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        onConnect(signer);
      } catch (error) {
        console.error('User rejected the request:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setShowAlert(true); // Show custom alert if wallet extension not installed
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-500 text-white p-8">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full text-center -mt-40 transition-transform duration-300 ease-in-out transform hover:shadow-3xl">
        <Wallet size={64} className="text-black mb-4 mx-auto" />
        <h2 className="text-3xl font-extrabold mb-4 text-gray-950">Connect Your Wallet</h2>
        <p className="text-gray-800 mb-6 text-lg">
          Join our decentralized BASE-FUNDS community savings pool. Contribute, borrow, and manage your funds securely.
        </p>
        <button
          onClick={handleConnect}
          disabled={loading}
          className={`bg-teal-500 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow transition-transform transform ${loading ? 'opacity-50' : 'hover:scale-105 hover:bg-teal-600'} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50`}
        >
          {loading ? 'Connecting...' : 'Connect with Coinbase Wallet'}
        </button>
      </div>

      {showAlert && (
        <div className="fixed bottom-4 right-4 p-4 bg-black text-white rounded-lg shadow-lg flex items-center space-x-3 animate-pulse">
          <span className="font-semibold">⚠️ Error:</span>
          <span>Please install the Coinbase Wallet extension.</span>
          <button
            onClick={() => setShowAlert(false)}
            className="text-white hover:bg-black p-1 rounded-lg focus:outline-none transition-transform transform hover:scale-110"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
