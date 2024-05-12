resource "local_file" "testChild" {
  filename        = "./child.txt"
  content    = "Child"
  file_permission = "777"
}