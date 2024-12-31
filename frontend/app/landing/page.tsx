import { AppBar } from "../components/AppBar"
import { HeroSection } from "../components/Hero"

export default function Landing() {
    return (
        <div className={`bg-[#090A0B] min-h-screen scroll-smooth`}>
            <AppBar/>
            <HeroSection/>            
        </div>
    )
}


