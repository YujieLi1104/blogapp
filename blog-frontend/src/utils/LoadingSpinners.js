import React from 'react';
import {css} from '@emotion/react';
import ClipLoader from "react-spinners/ClipLoader"

const LoadingSpinners = () => {
    const override = css`
    display: "block";
    margin: "0 auto";
    borderColor: "red";`;

  return (
    <ClipLoader color='#276749' loading={true} css={override} />
  )
}

export default LoadingSpinners