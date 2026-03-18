const FooterContent = () => {
  const styles = {
    container: 'bg-sky-800 text-white pt-5',

    title: "text-xl sm:text-3xl text-[#ffffffbb] border-b-2 pb-2 mb-3",

    content: "max-w-300 mx-auto flex flex-row items-start justify-between text-[#ffffff99] mx-10 px-10 py-5",
    contacts: "my-3",
    copyright: "bg-sky-900 text-[#ffffff50] text-center font-bold py-3",
    gmap_iframe: "rounded-xl w-full mt-5"
  }
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="w-1/3 text-left">
          <h1 className={styles.title}>Contact us</h1>
          <div className={styles.contacts}>
            <p><b>WhatsApp</b></p>
            <ul>
              <li>+62 899-1-911911</li>
            </ul>
          </div>
          <div className={styles.contacts}>
            <p><b>Phone</b></p>
            <ul>
              <li>+62 21-290-55-115</li>
              <li>+62 899-1-911911</li>
            </ul>
          </div>
          <div className={styles.contacts}>
            <p><b>Email</b></p>
            <ul>
              <li>info@dentalign.id</li>
            </ul>
          </div>
        </div>
        <div className="w-1/3 text-right">
          <h1 className={styles.title}>Address</h1>
          <p>Jl. Hang Tuah No 7, Kebayoran Baru, Jakarta Selatan 12120</p>
          <iframe className={styles.gmap_iframe} src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7932.507083884625!2d106.7975571!3d-6.2302681!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1464fc5bed5%3A0xdb83d9d775447e85!2sJl.%20Hang%20Tuah%20Raya%20No.7%2C%20RT.2%2FRW.6%2C%20Gunung%2C%20Kec.%20Kby.%20Baru%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2012120!5e0!3m2!1sen!2sid!4v1743730435748!5m2!1sen!2sid"
            loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      <div className={styles.copyright}>
        <h1>© 2018 Dentalign. All rights reserved.</h1>
      </div>
    </div>
  )
}

export default FooterContent
