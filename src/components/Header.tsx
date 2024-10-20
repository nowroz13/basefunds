import React from 'react';
import { PiggyBank } from 'lucide-react';

interface HeaderProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ isWalletConnected, connectWallet, disconnectWallet }) => {
  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PiggyBank size={32} />
          <h1 className="text-2xl font-bold">BaseFunds</h1>
        </div>
        <div>
          {isWalletConnected ? (
            <button
              onClick={disconnectWallet}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Disconnect Wallet
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
