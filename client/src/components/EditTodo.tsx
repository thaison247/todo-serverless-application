import * as React from 'react'
import { Form, Button, Image } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getTodoItemById, getUploadUrl, patchTodo, uploadFile } from '../api/todos-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}


interface EditTodoProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
}

interface EditTodoState {
  file: any
  uploadState: UploadState
  fileUrl: string
  name: string
  dueDate: string
  done: boolean
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    fileUrl: '',
    name: '',
    dueDate: '',
    done: false
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmitFile = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const {uploadUrl, attachmentUrl} = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.todoId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)
      this.setFileUrlState(attachmentUrl)
      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  setFileUrlState(attachmentUrl: string) {
    this.setState({
      fileUrl: attachmentUrl
    })
  }

  async componentDidMount() {
    try {
      const response = await getTodoItemById(this.props.auth.getIdToken(), this.props.match.params.todoId)
      let attachmentUrl = response.attachmentUrl? response.attachmentUrl : ''
      this.setState({
        name: response.name,
        dueDate: response.dueDate,
        done: response.done,
        fileUrl: attachmentUrl
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  handleSubmitTodoInfo = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await patchTodo(this.props.auth.getIdToken(), this.props.match.params.todoId, {
        name: this.state.name,
        dueDate: this.state.dueDate,
        done: this.state.done
      })

      alert('Update todo successfully!')

    } catch {
      alert('Todo creation failed')
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ dueDate: event.target.value })
  }



  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmitTodoInfo}>
          <Form.Group>
            <Form.Input
              placeholder='Name'
              name='name'
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <Form.Input
              placeholder='Due date'
              name='Due date'
              value={this.state.dueDate}
              onChange={this.handleDueDateChange}
            />
            <Form.Button content='Submit' />
          </Form.Group>
        </Form>

        <Image src={`${this.state.fileUrl}?${Date.now()}`} size='medium' bordered />

        <Form onSubmit={this.handleSubmitFile}>
          <Form.Field>
            <label>Choose file</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>

        
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
