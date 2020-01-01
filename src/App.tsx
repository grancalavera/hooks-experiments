import React, { useState, useContext, memo, useCallback } from "react";

const Context = React.createContext({
  loading: false,
  aboveTreeDepth: 0,
  belowTreeDepth: 0,
  toggleLoading: (): void => {
    throw new Error("toggleLoading not implemented");
  },
});

const ContextProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const toggleLoading = useCallback(() => {
    setLoading(!loading);
  }, [setLoading, loading]);

  const aboveTreeDepth = 0;
  const belowTreeDepth = 10;

  return (
    <Context.Provider value={{ loading, toggleLoading, aboveTreeDepth, belowTreeDepth }}>
      {children}
    </Context.Provider>
  );
};

const App: React.FC = () => {
  return (
    <ContextProvider>
      <TheApp />
    </ContextProvider>
  );
};

const TheApp: React.FC = () => {
  const { loading } = useContext(Context);
  return (
    <div>
      <WithToggler label={"above"} />
      <WithToggler label={"below"} />
      <p>{loading ? "loading" : "not loading"}</p>
    </div>
  );
};

const WithToggler: React.FC<DeepTreeProps> = ({ label }) => {
  const { toggleLoading } = useContext(Context);
  return (
    <>
      <DeepTree label={label} treeDepth={5} />
      <button onClick={() => toggleLoading()}>Toggle Loading from {label}</button>
    </>
  );
};

interface DeepTreeProps {
  label: string;
  treeDepth?: number;
}

const DeepTree: React.FC<DeepTreeProps> = memo(({ label, treeDepth = 0 }) => {
  console.count(`${label} render count`);

  return [...Array(treeDepth)]
    .map((_, i) => treeDepth - i)
    .reduce((nested, level) => {
      return <Nester level={level}>{nested}</Nester>;
    }, <p>{label}</p>);
});

interface NesterProps {
  level: number;
}

const Nester: React.FC<NesterProps> = ({ children, level }) => {
  console.count(`nester level ${level} render count`);
  return (
    <div className="nested-component">
      level: {level}
      {children}
    </div>
  );
};

export default App;
