export default function Home() {
  return (
    <div className="p-8">
      <div className="flex justify-center items-center flex-col">
        <div className="font-bold text-lg mb-4">👋 E ae Galera!</div>

        <div className="max-w-[500px] text-center flex flex-col">
          Eu sou o thiago0x01, desenvolvedor full stack e estou aprendendo
          Solidity! Conecte sua carteira Ethereum e acene pra mim!
          <button className="bg-[#DEE5E5] px-4 py-2 rounded-lg mt-8">
            Acenar
          </button>
        </div>
      </div>
    </div>
  );
}
