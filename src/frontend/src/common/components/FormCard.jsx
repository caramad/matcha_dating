import React from 'react';
import styles from './FormCard.module.css';

const FormCard = ({ title, children, className = '', ...props }) => {
  return (
    <div className={`${styles.formCard} ${className}`} {...props}>
      {title && (
        <h2 className={styles.formCard__title}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default FormCard;
