import {useEffect} from 'react';
import styles from './fakeAd.module.css'

const adClasses = ['wide', 'medium', 'weird']


export default function FakeAd({ isOpen, closeModal }) {

useEffect(()=>{
    console.log(this);
    setTimeout(()=>{
        // todo randomly select class
    }, 500)
})

  return (
    <div className={styles.contents}>
        <p>ad goes here</p>
    </div>
  );
}
