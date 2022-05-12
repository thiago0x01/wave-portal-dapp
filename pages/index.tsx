import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import abi from '../src/utils/WavePortal.json';

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [totalWaves, setTotalWaves] = useState<number>();
  const [loading, setLoading] = useState(false);

  const contractAddress = '0xd719E82AF4bFD3cDd3f7C14CFc4830784eBC0306';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        console.log('Garanta que possua a Metamask instalada!');
        return;
      } else {
        console.log('Temos o objeto ethereum', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Encontrada a conta autorizada:', account);
        setCurrentAccount(account);
      } else {
        console.log('Nenhuma conta autorizada foi encontrada');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        console.log('Garanta que possua a Metamask instalada!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Conectado', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = useCallback(async () => {
    try {
      const { ethereum } = window as any;

      if (ethereum) {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const waveTxn = await wavePortalContract.wave();
        console.log('Minerando...', waveTxn.hash);

        await waveTxn.wait();
        console.log('Minerado -- ', waveTxn.hash);
        setLoading(false);
      } else {
        setLoading(false);
        console.log('Objeto Ethereum não encontrado!');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [contractABI]);

  const getTotalWaves = useCallback(async () => {
    try {
      const { ethereum } = window as any;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const count = await wavePortalContract.getTotalWaves();
        setTotalWaves(count.toNumber());
      } else {
        console.log('Objeto Ethereum não encontrado!');
      }
    } catch (error) {
      console.log(error);
    }
  }, [contractABI]);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    getTotalWaves();
  }, [getTotalWaves, wave]);

  return (
    <div className="p-8">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 text-lg font-bold">👋 E ae Galera!</div>

        <div className="max-w-[500px] text-center flex flex-col">
          Eu sou o thiago0x01, desenvolvedor full stack e estou aprendendo
          Solidity! Conecte sua carteira Ethereum e acene pra mim!
          <button
            disabled={loading}
            className={`font-bold bg-[#DEE5E5] px-4 py-2 rounded-lg mt-8 ${
              loading && 'brightness-50'
            }`}
            onClick={wave}
          >
            {loading ? 'Processando...' : 'Acenar'}
          </button>
          <button
            className={`font-bold px-4 py-2 rounded-lg mt-4 mb-8 ${
              currentAccount ? 'bg-[#17B890] text-[#082D0F]' : 'bg-[#DEE5E5]'
            }`}
            onClick={connectWallet}
          >
            {currentAccount ? 'Conectado' : 'Conectar carteira'}
          </button>
        </div>

        {totalWaves && (
          <p className="font-bold">thiago0x01 tem {totalWaves} acenos!</p>
        )}

        <p className="text-red-400">
          Certifique se de estar na conectado na rede de teste Goerli.
        </p>
      </div>
    </div>
  );
}
