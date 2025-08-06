import { Button } from '../ui/index.jsx'

function Pagination({ currentPage, totalPages, onPageChange }) {
  // 生成页码按钮
  const renderPageButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    // 计算起始和结束页码
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = startPage + maxVisiblePages - 1

    // 调整结束页码，如果超过总页数
    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // 添加第一页按钮
    if (startPage > 1) {
      buttons.push(
        <Button
          key="first"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      )

      // 添加省略号
      if (startPage > 2) {
        buttons.push(<span key="ellipsis-start" className="px-2">...</span>)
      }
    }

    // 添加中间页码按钮
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      )
    }

    // 添加省略号
    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis-end" className="px-2">...</span>)
    }

    // 添加最后一页按钮
    if (endPage < totalPages) {
      buttons.push(
        <Button
          key="last"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      )
    }

    return buttons
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        上一页
      </Button>

      {renderPageButtons()}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        下一页
      </Button>
    </div>
  )
}

export default Pagination