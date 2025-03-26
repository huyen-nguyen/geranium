import os

def read_txt_files_and_write_output(folder_path, output_file_path):
    # Try to get all files in the given directory
    try:
        files = os.listdir(folder_path)
    except Exception as e:
        print(f"Error accessing the folder: {e}")
        return

    # Filter and sort the text files with case-insensitive sorting
    txt_files = sorted([f for f in files if f.endswith(".txt")], key=str.lower)

    # Write the output to the specified file
    try:
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            for filename in txt_files:
                # Construct the full path to the file
                file_path = os.path.join(folder_path, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as file:
                        content = file.read()
                    # Write the file name
                    output_file.write(f"File Name: {filename}\n")
                    # Write the file content
                    output_file.write("Content:\n")
                    output_file.write(content + "\n")
                    output_file.write("\n" + "="*40 + "\n\n")
                except Exception as e:
                    output_file.write(f"Could not read file {filename}: {e}\n")
                    output_file.write("\n" + "="*40 + "\n\n")
    except Exception as e:
        print(f"Could not write to the output file: {e}")

# Example usage:
folder_path = '../../data/unified/alt_0_2_2'  # Replace with your folder path
output_file_path = './alt_0_2_2.txt'
read_txt_files_and_write_output(folder_path, output_file_path)