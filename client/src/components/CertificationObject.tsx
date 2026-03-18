import React from 'react'

interface Props { img: string, title: string, subtitle: string, desc: string }

const CertificationObject: React.FC<Props> = ({ img, title, subtitle, desc }) => {
  const styles = {
    container: "flex flex-col xl:flex-row items-center gap-10 my-10",
    name: "text-3xl pb-2 mb-2 border-b-2",
    subtitle: "",
    desc: "text-lg mt-2",
  }
  return (
    <div className={styles.container}>
      <img src={img} alt="" />
      <div>
        <h1 className={styles.name}>{title}</h1>
        <h5 className={styles.subtitle}><b>{subtitle}</b></h5>
        <p className={styles.desc}>{desc}</p>
      </div>
    </div>
  )
}

export default CertificationObject
