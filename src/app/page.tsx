import './page.scss'
import Headers from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

export default function Home() {
  return (
    <>
    <Headers />
    <main className='main_container'>
      <div className='main_create_exam_container'>
        <p className='main_explication_text'>Pour pouvoir créer votre examen vous pouvez mettre la leçon que vous souhaitez dans le champ 
          ci-dessous manuellement ou par pdf qui ce trouve juste en dessous du champ.</p>
          
          <textarea name="" id="" cols="30" rows="10"></textarea>
      </div>
    </main>
    <Footer />
    </>
  )
}
