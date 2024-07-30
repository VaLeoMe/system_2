export interface ThemeProps {
  name: string
  background: string //bg image
  text: string
  primary: string
  primaryHover: string
  primaryText: string
  highlight: string
  highlightBorder: string
  foreground: string
  connectWalletText: string
  connectWalletBackground: string
  connectWalletBorder: string
}

export const darkTheme: ThemeProps = {
  name: 'dark',
  background:
    'radial-gradient(circle at top, rgb(48,48,48) 0, rgb(33,36,41) 100%);',
  text: '#fff',
  primary: 'rgb(33, 114, 229)',
  primaryHover: 'rgb(25, 102, 212)',
  primaryText: '#fff',
  highlight: 'rgb(25, 27, 31)',
  highlightBorder: 'rgb(33, 36, 41)',
  foreground: 'rgb(33, 36, 41)',
  connectWalletText: 'rgb(80, 144, 234)',
  connectWalletBackground: 'rgba(21, 61, 111, 0.44)',
  connectWalletBorder: 'rgba(21, 61, 111, 0.44)'
}

export const lightTheme: ThemeProps = {
  name: 'light',
  background:
    'radial-gradient(circle at top,rgba(116,32,21,0.2) 0, white 100%);',
  text: '#000',
  primary: 'rgba(169,32,33,1)',
  primaryHover: 'rgb(116,32,21)',
  primaryText: '#fff',
  highlight: 'rgb(255, 255, 255)',
  highlightBorder: 'rgb(247, 248, 250)',
  foreground: 'rgb(247, 248, 250)',
  connectWalletText: 'rgba(169,32,33,1)',
  connectWalletBackground: 'rgba(169,32,33,0.1)',
  connectWalletBorder: 'rgb(253, 234, 241)'
}

export const oldDarkTheme: ThemeProps = {
  name: 'dark',
  background:
    'radial-gradient(circle at top, rgb(46,34,45) 0, rgb(33,36,41) 100%);',
  text: '#fff',
  primary: 'rgb(33, 114, 229)',
  primaryHover: 'rgb(25, 102, 212)',
  primaryText: '#fff',
  highlight: 'rgb(25, 27, 31)',
  highlightBorder: 'rgb(33, 36, 41)',
  foreground: 'rgb(33, 36, 41)',
  connectWalletText: 'rgb(80, 144, 234)',
  connectWalletBackground: 'rgba(21, 61, 111, 0.44)',
  connectWalletBorder: 'rgba(21, 61, 111, 0.44)'
}

export const oldLightTheme: ThemeProps = {
  name: 'light',
  background: 'radial-gradient(circle at top, rgb(247,232,242) 0, white 100%);',
  text: '#000',
  primary: 'rgb(232, 0, 111)',
  primaryHover: 'rgb(213,1,103)',
  primaryText: '#fff',
  highlight: 'rgb(255, 255, 255)',
  highlightBorder: 'rgb(247, 248, 250)',
  foreground: 'rgb(247, 248, 250)',
  connectWalletText: 'rgb(213, 0, 102)',
  connectWalletBackground: 'rgb(253, 234, 241)',
  connectWalletBorder: 'rgb(253, 234, 241)'
}
