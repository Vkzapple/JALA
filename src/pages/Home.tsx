import Navbar from "../components/Navbar"
import MainFeature from "../components/feature/MainFeature"

const Home = () => {
    return (
        <>
            <Navbar />
            <main className=" w-dvw h-dvh flex justify-center mt-24 gap-8">
                <MainFeature />
            </main>
        </>
    )
}

export default Home