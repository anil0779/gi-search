

import styled from 'styled-components';

export const InputBox = styled.input`
    min-height: 18px;
    border-radius: 4px;
    border: 1px solid transparent;
    padding: 8px;
    width: ${props => (props.width ? props.width : '100%')}

    @media screen and (max-width: 480px) {
        width: 100%
    }
`;

export const Button = styled.input`
    min-height: 18px;
    border-radius: 4px;
    border: 1px solid transparent;
    padding: 8px;
    min-width: 100px;
    background: #256FEF;
    color: #FFF;
    box-shadow: 0px 6px 8px rgba(28, 28, 28, 0.08);

    @media screen and (max-width: 480px){
        width: 100%
    }
`;

export const Loader = styled.i`
    position: fixed;
    top: 40%;
    left: 55%;
    width: 100%;
    height: 100%;

    @media screen and (max-width: 480px){
        left: 70%
    }
`