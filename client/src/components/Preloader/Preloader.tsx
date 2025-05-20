import Style from './Preloader.module.css'
import PreloaderAnimation from './PreloaderAnimation.gif'

export default function Preloader({preloaderText}: {preloaderText?: string}) {
  return (
    <div className={Style.preloaderContainer}>
      <img src={PreloaderAnimation} alt="preloader gif animation" />
      <h1>
        {
          preloaderText ? preloaderText : 'Učitavanje podataka...'
        }
      </h1>
    </div>
  )
}
