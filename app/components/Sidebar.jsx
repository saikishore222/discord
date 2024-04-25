import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaugh, faPalette, faImage, faFileAlt, faFont } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const items = [
        { label: 'Memes', href: '/Chat?type=Memes', icon: faLaugh },
        { label: 'Logos', href: '/Chat?type=Logos', icon: faPalette },
        { label: 'Images', href: '/Chat?type=Images', icon: faImage },
        { label: 'Resumes', href: '/Chat?type=Resumes', icon: faFileAlt },
        { label: 'Texts', href: '/Chat?type=Texts', icon: faFont },
    ];

    return (
        <div className="w-72 mt-16 bg-white h-full fixed shadow-md opacity-100" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="flex flex-col p-4 space-y-2">
                {items.map((item, index) => (
                    <Link key={index} href="/chat?type=[type]" as={item.href}>
                        <div className='flex items-center p-3 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                            <FontAwesomeIcon icon={item.icon} className="text-xl text-gray-600 mr-4" size="lg" />
                            <span className="text-lg font-medium text-gray-900">{item.label}</span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="border-t border-gray-200"></div>
            <div className="flex flex-col p-4 space-y-2">
                <span className="text-lg font-semibold text-gray-900">Private Channels</span>
                <div className='flex items-center p-3 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
                    <FontAwesomeIcon icon={faFileAlt} className="text-xl text-gray-600 mr-4" size="lg" />
                    <Link href="/Chat?type=Private">
                    <span className="text-lg font-medium text-gray-900">My Channel</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;