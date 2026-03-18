import HeaderBar from '../components/HeaderBar'
import Jumbotron from '../components/Jumbotron'
import FooterContent from '../components/FooterContent'

function Articles() {
  return (
    <>
      <header>
        <HeaderBar />
        <Jumbotron img={"src/assets/aboutus-jumbotron.png"} text="ARTICLES" />
      </header>
      <main>

      </main>
      <footer>
        <FooterContent />
      </footer>
    </>
  )
}

export default Articles
