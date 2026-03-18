import React from 'react'

interface Props { img: string, text: string }

const Jumbotron: React.FC<Props> = ({ img, text }) => {
  const url: string = (img[0] === '/') ? img : '/' + img
  const styles = {
    container: `bg-no-repeat bg-cover bg-center text-white min-h-100 flex items-end`,
    content: "bg-[#00000075] flex flex-col items-center flex-grow gap-10 p-5",
    header: "text-3xl sm:text-5xl font-bold",
  }
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${url})` }}>
      <div className={styles.content}>
        <h1 className={styles.header}>{text}</h1>
      </div>
    </div>
  )
}

export default Jumbotron
