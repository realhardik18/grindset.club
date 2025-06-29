import Sidenav from '../components/Sidenav'

export default function Dashboard(){
    return(
        <div className="min-h-screen bg-black text-white flex">
            <Sidenav />
            <div className="flex-1 transition-all duration-300 ease-in-out" style={{ marginLeft: '16rem' }}>
                <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                            Welcome to the Dashboard
                        </h1>
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
                            <p className="text-gray-300 text-lg">
                                Your command center for peak performance. Use the sidebar to navigate between different sections.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}