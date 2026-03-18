import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SlidingTestimonies = () => {
  const [current, setCurrent] = useState<number>(0)
  const [direction, setDirection] = useState<number>(1)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonies.length);
    }, 5000)
    return () => clearInterval(interval);
  });
  const testimonies = [
    {
      text: "I highly recommend this, Dr Melinda is an excellent dentist whose always making her patients are comfortable and get the best solution she can offer. Not only she take a good care of my teeth but she also make me understand about the importance of oral health. I will definitely recommend this place to my family and friends.",
      author: "Gustiano"
    },
    {
      text: "Very pleasant indeed! Dr. Melinda is a great doctor who listens to the patient and takes care of her patient with great attention.",
      author: "Lenny"
    },
    {
      text: "Dr Melinda realigned my teeth with so much patience, little by little. Now my teeth are in better shape now!",
      author: "Ellen Stanni"
    },
    {
      text: "My most favourite dentist. She takes care of me and my family. If you are looking for a very good dentist in Jakarta, I recommend her.",
      author: "Bunlope Achanai"
    },
    {
      text: "Going to the dentist was never this fun when I was a kid. Thanks Dr. Melinda!",
      author: "Riaz Hyder"
    },
  ]

  const styles = {
    container: "max-w-300 mx-auto text-center text-white",
    title: "text-3xl sm:text-5xl pb-3 border-b-3 font-bold",
    quote: "bg-[#00000050] flex flex-col items-center justify-center rounded-xl text-lg xl:mx-10 px-10 py-7 my-5 h-100",
    node_container: "mt-4 flex space-x-3 w-fit mx-auto",
    nodes: `w-4 h-4 rounded-full transition-colors duration-500 `
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Testimonials from our patients</h1>
      <div className={styles.quote}>
        <motion.div
          key={current}
          initial={{ x: direction * 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -direction * 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}>
          <p><i>"
            {testimonies[current].text}
            "</i></p>
          <br />
          <p>~ {testimonies[current].author}</p>
        </motion.div>
      </div>
      <div className={styles.node_container}>
        {testimonies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={styles.nodes + `${current === index ? "bg-white" : "bg-sky-700"}`}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default SlidingTestimonies
