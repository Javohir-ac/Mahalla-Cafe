import { motion } from 'framer-motion'
import React from 'react'
import aboutImage from '../assets/about-page.jpg'
import styles from './About.module.scss'

const About: React.FC = () => {
  return (
    <div className={styles.about}>
      {/* Header section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.container}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Biz haqimizda
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Mahalliy taomlarga mehr bilan yondashamiz
          </motion.p>
        </div>
      </motion.section>

      <div className={styles.container}>
        {/* Main content section */}
        <motion.section
          className={styles.contentSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.contentWrapper}>
            <div className={styles.imageContainer}>
              <img
                src={aboutImage}
                alt='Mahalla Cafe restorani'
                className={styles.aboutImage}
              />
            </div>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>Mahalla Cafe tarixi</h2>
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
            </div>
          </div>
        </motion.section>

        {/* CTA section */}
        <motion.section
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Biz bilan tajriba qiling</h2>
            <p className={styles.ctaText}>
              Mahalla Cafeda noyob ta'mlarni his qiling va ajoyib xotira yaratib oling
            </p>
            <motion.button
              className={styles.ctaButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Bron qilish
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default About
