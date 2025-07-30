import moment from 'moment'

const Footer = () => {
  const year = moment().format('YYYY')

  return (
    <footer className="text-center text-xs text-gray-500 py-6">
      <div>Copyright © {year} sunxianqiang. All rights reserved.</div>

      <div className="mt-1">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:underline "
          style={{ textDecoration: 'none' }}
        >
          鲁ICP备2025174839号-1
        </a>
      </div>
    </footer>
  )
}

export default Footer
