resource "local_file" "testFile21" {
  filename = var.file.path
  content  = var.file.content
}
