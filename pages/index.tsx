import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import abi from '../src/utils/WavePortal.json';

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [totalWaves, setTotalWaves] = useState('');
  const [loading, setLoading] = useState(false);
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState('');

  const contractAddress = '0xA13C3FA471c3978d09d5796Abb9e72baCc93Abc0';
  const contractABI = abi.abi;

  const getAllWaves = useCallback(async () => {
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

        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map((wave) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log('Objeto Ethereum não existe!');
      }
    } catch (error) {
      console.log(error);
    }
  }, [contractABI]);

  const checkIfWalletIsConnected = useCallback(async () => {
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
        getAllWaves();
      } else {
        console.log('Nenhuma conta autorizada foi encontrada');
      }
    } catch (error) {
      console.log(error);
    }
  }, [getAllWaves]);

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

        const waveTxn = await wavePortalContract.wave(message, {
          gasLimit: 300000,
        });
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
  }, [contractABI, message]);

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

  const changeMessage = async (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected, loading]);

  useEffect(() => {
    getTotalWaves();
  }, [getTotalWaves, wave, loading]);

  return (
    <div className="p-8">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 text-lg font-bold">👋 E ae Galera!</div>

        <div className="max-w-[600px] text-center flex flex-col">
          Meu nome é Thiago Machado @thiago0x01, sou desenvolvedor full stack e
          estou aprendendo sobre Web3 & Solidity! Conecte sua carteira Ethereum
          e acene me recomendando uma extensão legal para o VSCode!
          <textarea
            className={`font-bold px-4 py-2 rounded-lg mt-4 mb-8 ${
              currentAccount ? 'bg-[#17B890] text-[#082D0F]' : 'bg-[#DEE5E5]'
            }`}
            onChange={changeMessage}
          />
          <button
            disabled={loading}
            className={`font-bold bg-[#DEE5E5] px-4 py-2 rounded-lg ${
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
          {totalWaves && (
            <p className="font-bold">@thiago0x01 tem {totalWaves} aceno(s)!</p>
          )}
          <p className="text-red-400">
            Certifique se de estar na conectado na rede de teste Goerli.
          </p>
          {allWaves.map((wave, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-start justify-start mb-4"
              >
                <div>
                  <span className="font-bold">Endereço:</span> {wave.address}
                </div>
                <div>
                  <span className="font-bold">Data/Horário:</span>{' '}
                  {wave.timestamp.toString()}
                </div>
                <div>
                  <span className="font-bold">Mensagem:</span> {wave.message}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
