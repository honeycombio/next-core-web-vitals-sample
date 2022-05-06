import {createRef, useEffect} from 'react';
import styles from './fakeAd.module.css'

const adClasses = [
  'wide',
  'medium',
  'weird',
]

const adEl = createRef();  

export default function FakeAd() {
    useEffect(() => {
        setTimeout(() => {
            const chosenAd = adClasses[Math.floor(Math.random() * adClasses.length)];
            if (adEl.current) {
              adEl.current.classList.add(styles[chosenAd]);
            }
        }, 1500)
    })

  return (
    <div className={styles.contents} ref={adEl}>
        {/* <p>ad goes here</p> */}
    </div>
  );
}
