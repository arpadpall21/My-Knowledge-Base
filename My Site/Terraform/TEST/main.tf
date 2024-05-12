
resource "local_file" "testFile" {
  filename        = var.file[0]
  content         = "${random_string.rand-str.id}"
  file_permission = "777"
}

resource "local_file" "fileX" {
  filename        = "fileX.txt"
  content         = "Hi! I'm awesome (again)!"
  file_permission = "777"
}

resource "random_string" "rand-str" {
  length    = 32
}
