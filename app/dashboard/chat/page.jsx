import Sidenav from '../../components/Sidenav'

export default function Chat(){
    return(
        <div className="flex min-h-screen">
            <Sidenav />
            <div className="flex-1 transition-all duration-300 ease-in-out" style={{marginLeft: 'var(--sidenav-width, 16rem)', padding: '2rem'}}>
                <p className="text-4xl">hello</p>
            </div>
        </div>
    )
}