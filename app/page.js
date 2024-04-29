// components/Home.js
import Link from 'next/link';

const Home = () => {
    return (
        <div className="flex flex-col items-center mx-auto border-2 border-black h-full justify-center ">
            <h1 className="text-4xl font-bold mb-4">Welcome to Datalab AI</h1>
            <p className="text-xl text-gray-600 mb-8">Start Enganging in Channels to interact with Models</p>
        </div>
    );
};

export default Home;
