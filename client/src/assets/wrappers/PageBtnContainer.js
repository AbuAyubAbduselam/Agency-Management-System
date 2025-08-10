import styled from 'styled-components';

const Wrapper = styled.section`
  height: auto; /* let it grow when wrapping */
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-wrap: wrap;
  gap: 1rem;

  .btn-container {
    background: var(--background-secondary-color);
    border-radius: var(--border-radius);
    display: flex;
    flex-wrap: wrap; /* allow buttons to wrap */
    gap: 0.25rem;
    justify-content: center;
  }

  .page-btn {
    background: transparent;
    border-color: transparent;
    width: 50px;
    height: 40px;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--primary-500);
    border-radius: var(--border-radius);
    cursor: pointer;
  }

  .active {
    background: var(--primary-500);
    color: var(--white);
  }

  .prev-btn,
  .next-btn {
    background: var(--background-secondary-color);
    border-color: transparent;
    border-radius: var(--border-radius);
    width: 100px;
    height: 40px;
    color: var(--primary-500);
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .prev-btn:hover,
  .next-btn:hover {
    background: var(--primary-500);
    color: var(--white);
    transition: var(--transition);
  }

  .dots {
    display: grid;
    place-items: center;
    cursor: text;
  }

  /* 📱 Responsive styles for small devices */
  @media (max-width: 640px) {
    justify-content: center;

    .page-btn {
      width: 36px;
      height: 32px;
      font-size: 0.9rem;
    }

    .prev-btn,
    .next-btn {
      width: auto;
      padding: 0 8px;
      height: 32px;
      font-size: 0.9rem;
      gap: 0.25rem;
    }
  }
`;

export default Wrapper;
