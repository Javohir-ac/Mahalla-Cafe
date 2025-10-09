import { motion } from 'framer-motion'
import React from 'react'
import aboutImage from '../assets/about-page.jpg'
import ContactSection from '../components/ContactSection'
import FeaturedItems from '../components/FeaturedItems'
import Hero from '../components/Hero'
import styles from './Home.module.scss'

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <Hero />
      <motion.section
        className={styles.section}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.container}>
          <FeaturedItems />
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id='about'
        className={styles.aboutSection}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.container}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Biz haqimizda
          </motion.h2>
          <div className={styles.aboutContent}>
            <motion.div
              className={styles.aboutText}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className={styles.paragraph}>
                Mahalla Cafe 2010-yilda O'zbekiston milliy taomlarini dunyoga tanitish
                maqsadida tashkil etildi. Bizning missiyamiz - har bir mijozga uyda
                bo'lgandek iliq his qilish imkonini beruvchi, milliy an'analar asosida
                tayyorlangan taomlarni taklif etishdir.
              </p>
              <p className={styles.paragraph}>
                Kichik oilaviy restoran sifatida boshlangan bu joy endi O'zbekiston
                taomlarining sevimli institutiga aylandi. Biz asosiy qadriyatlarimizni
                hech qachon yo'qotmadik: yangi, mahalliy yetishtirilgan mahsulotlardan
                foydalanish, jamoamizni qo'llab-quvvatlash va shaxsiy tezatilgan a'lo
                xizmat ko'rsatish.
              </p>
              <p className={styles.paragraph}>
                Har bir taom g'amxo'rlanib tayyorlanadi, avlodlardan avlodga o'tkazilgan
                retseptlar va zamonaviy texnikalar bilan yangilanadi. Oshpaz jamoamiz
                mahsulotlarni imkon qadar mahalliy fermer xo'jaliklari va ishlab
                chiqaruvchilardan sotib olishga mamnun, bu esa har bir taom nafaqat
                mazali, balki mahalliy iqtisodiyotni qo'llab-quvvatlashi va atrof-muhit
                zararini kamaytirishini ta'minlaydi.
              </p>
            </motion.div>
            <motion.div
              className={styles.aboutImage}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src={aboutImage} alt='Mahalla Cafe restorani' />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section - now imported as a separate component */}
      <ContactSection />
    </div>
  )
}

export default Home
