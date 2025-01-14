import styled from "@emotion/styled";
import { NextImage } from "../next/Image";

const Loader = () => {
  return (
    <LoaderStyled>
      <div className="modal-container">
        {/* <Loading01Svg width={164} height={164} /> */}
        <NextImage
          src={"/images/logo-transparent.png"}
          alt="LoaderStyled"
          width={240}
          height={240}
        />
      </div>
    </LoaderStyled>
  );
};

const LoaderStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  .modal-container {
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .modal-container .text-redirect {
    margin-top: 36px;
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
  }
  .modal-container .text-counter {
    color: ${({ theme }) => theme.colorPrimary};
  }
`;

export default Loader;
