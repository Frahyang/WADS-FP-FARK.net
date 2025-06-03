import HeaderBar from '../components/HeaderBar'
import FooterContent from '../components/FooterContent'
import SlidingTestimonies from '../components/SlidingTestimonies'
import Chatbot from '../components/Chatbot'

import { useNavigate } from 'react-router-dom'
import CertificationObject from '../components/CertificationObject'

function Home() {
    const certifications = [
        {
            img: "src/assets/logo-invisalign.png",
            title: "Certified Invisalign Clinic",
            subtitle: "At Dentalign, we specialize in Invisalign treatment for both adults and kids.",
            desc: "Invisalign is an invisible way to straighten your teeth without braces. This technique uses a series of clear, removable aligners to gradually straighten teeth, without metal or wires. Invisalign is a clear alternative to traditional braces.",
        },
        {
            img: "src/assets/logo-damonsmile.png",
            title: "Certified Damon System Clinic",
            subtitle: "At Dentalign, we also specialize in Damon System treatment for all our customers.",
            desc: "The Damon System is not just about revolutionary braces and wires, it’s a whole new way of treating patients. Traditional treatment often requires removal of healthy teeth and/or the use of palatal expanders to make space. This approach is often uncomfortable, takes longer, and can leave a narrower arch and a flat profile. Damon smiles are full, natural 10-tooth smiles achieved with light biologically-sensible forces, and are specifically designed to improve the overall facial result of each patient.",
        },
        
    ]

    const nav = useNavigate()
    const styles = {
        jumbotron: "bg-[url(/src/assets/home-jumbotron.png)] bg-no-repeat bg-cover bg-center text-white min-h-150 flex items-center",
        jumbo_content: "bg-[#00000075] flex flex-col items-start flex-grow gap-10 p-10",
        jumbo_desc: "md:w-2/3 text-center md:text-left",
        jumbo_header: "text-3xl sm:text-5xl border-b-3 pb-5 mb-5 text-shadow-lg/30",
        jumbo_bookBtn: "transition-colors bg-green-600 hover:bg-green-500 cursor-pointer w-fit md:text-left p-5 mx-auto md:mx-0 text-2xl font-bold",

        section: "px-10 py-15 ",

        about_container: "max-w-300 mx-auto flex xl:flex-row flex-col items-center justify-center gap-10",
        about_img: "xl:w-3/4",
        about_title: "text-4xl border-b-2 pb-3",
        about_desc: "my-4 text-justify",
        about_readmore: "transition-colors cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white font-bold p-2 md:w-1/2",

        certif_container: "max-w-300 mx-auto",
    }
    return (
        <>
            <header>
                <HeaderBar />
                <div className={styles.jumbotron}>
                <div className={styles.jumbo_content}>
                    <div className={styles.jumbo_desc}>
                    <h1 className={styles.jumbo_header}>Need Help? We're Here for You</h1>
                    <p>
                        Whether you're facing a dental issue, have questions about your treatment, or need technical assistance,
                        our support team is ready to assist you. Submit a support request and we'll get back to you as soon as possible.
                    </p>
                    </div>
                    <button onClick={() => nav('/signup')} className={styles.jumbo_bookBtn}>
                    Submit a Support Request
                    </button>
                </div>
                </div>
            </header>
            <main>
                <section className={styles.section + "bg-white"}>
                    <div className={styles.about_container}>
                        <div className={styles.about_img}>
                            <img src="src/assets/melinda.jpg" alt="" />
                        </div>
                        <div>
                            <h1 className={styles.about_title}>Dr. Melinda</h1>
                            <p className={styles.about_desc}>Dr. Melinda has developed a great reputation as a family dentist. She is also very passionate about dentistry and understands the importance of offering quality dental care to both adults and children. She will ensure you receive the highest standards of dental care in a good communication so patient will understand why it’s important and how to maintain oral hygiene.</p>
                        </div>
                    </div>
                </section>
                <section className={styles.section + "bg-linear-to-b from-sky-600 to-sky-500"}>
                    <SlidingTestimonies />
                </section>
                <section className={styles.section + "bg-blue-100"}>
                    <div className={styles.certif_container}>
                        {certifications.map(({img, title, subtitle, desc}) => 
                            <CertificationObject img={img} title={title} subtitle={subtitle} desc={desc} />
                        )}
                    </div>
                </section>
            </main>
            <footer>
                <FooterContent />
                <Chatbot />
            </footer>
        </>
    )
}

export default Home