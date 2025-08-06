import { Button, TextArea, FormError } from '../ui/index.jsx'

function CommentForm({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  placeholder,
  submitText = '发表评论',
  cancelText = null,
  onCancel = null,
  error = null
}) {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      {error && <FormError>{error}</FormError>}

      <div className="mb-4">
        <TextArea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-3">
        {cancelText && onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {cancelText}
          </Button>
        )}
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '提交中...' : submitText}
        </Button>
      </div>
    </form>
  )
}

export default CommentForm