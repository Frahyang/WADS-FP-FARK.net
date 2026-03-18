import HeaderBar from '../components/HeaderBar'
import Jumbotron from '../components/Jumbotron'
import FooterContent from '../components/FooterContent'

function Contact() {
  const styles = {
    form: 'shadow-xl/20 rounded-xl py-5 px-10 flex flex-col border border-gray-200',
    form_header: 'text-center text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-5',
    input_cont: 'flex flex-col my-2',
    input: ' bg-gray-100 p-2 flex-grow rounded-md',
    submit: 'bg-blue-400 hover:bg-blue-600 text-white font-semibold p-2 my-2 rounded-xl transition-colors',
    section: "px-10 py-15 "
  }

  return (
    <>
      <header>
        <HeaderBar />
        <Jumbotron img="src/assets/contact-jumbotron.png" text="CONTACT US" />
      </header>
      <main>
        <section>
          <img src="src/assets/text-logo.png" alt="" />
        </section>
        <section className={styles.section}>
          <form className={styles.form} action="">
            <h1 className={styles.form_header}>Make An Appointment</h1>
            <div className='flex flex-row gap-3'>
              <div className={styles.input_cont + " flex-grow"}>
                <label htmlFor="">First Name</label>
                <input className={styles.input} type="text" placeholder='First name' />
              </div>
              <div className={styles.input_cont + " flex-grow"}>
                <label htmlFor="">Last Name</label>
                <input className={styles.input} type="text" placeholder='Last name' />
              </div>
            </div>
            <div className={styles.input_cont}>
              <label htmlFor="">Email</label>
              <input className={styles.input} type="email" placeholder='Email' />
            </div>
            <div className={styles.input_cont}>
              <label htmlFor="">Phone Number</label>
              <input className={styles.input} type="text" placeholder='Phone Number' />
            </div>
            <div className={styles.input_cont}>
              <label htmlFor="">What is the appointment for?</label>
              <textarea className={styles.input + " h-30"} name="appointment_desc" id="" placeholder='Description here'></textarea>
            </div>
            <div className={styles.input_cont}>
              <label htmlFor="">Preferred Time for Appointment</label>
              <input className={styles.input} type="datetime-local" />
            </div>
            <input className={styles.submit} type="submit" />
          </form>
        </section>
      </main>
      <footer>
        <FooterContent />
      </footer>
    </>
  )
}

export default Contact
