import pngimage from '../../public/images.png'
const Navbar = () => {
  return (
    <main className=" w-dvw p-4 px-8 bg-neutral-50/80 flex justify-between shadow">
        <section className=" flex gap-2">   
          <div className="">
            <i className="bi bi-bus-front-fill me-4 text-blue-600 drop-shadow text-4xl"></i>
          </div>
          <div className=" flex flex-col">
            <span className=" font-semibold text-blue-600">JALA-Support</span>
            <span className=" text-neutral-600">Software for Driver</span>
          </div>
        </section>
        <section>
          <img src={pngimage} alt="" className=' w-12 h-12'/>
        </section>
    </main>
  )
}

export default Navbar