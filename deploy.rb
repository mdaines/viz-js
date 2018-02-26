require "octokit"
require "git"
require "shellwords"
require "json"

project_name = "Viz.js"
repo_slug = ENV["TRAVIS_REPO_SLUG"]
release_tag_name = ENV["TRAVIS_TAG"]
build_dir = ENV["TRAVIS_BUILD_DIR"]
asset_paths = ["viz.js", "viz-lite.js"].map { |name| File.join(build_dir, name) }

# Validate that version numbers match

raise "Invalid tag name: #{release_tag_name}" unless release_tag_name =~ /^v(\d+\.\d+\.\d+(?:-pre\.\d+)?)$/
version = $1
is_prerelease = version.include?("-pre")

asset_paths.each do |path|
  unless File.read(path).include?("#{project_name} #{version}")
    raise "Asset has incorrect version number: #{path}"
  end
end

npm_package_json = JSON.parse(File.read("package.json"))

unless npm_package_json["version"] == version
  raise "package.json has incorrect version number"
end

# Create release and upload assets

client = Octokit::Client.new(:access_token => ENV["GITHUB_TOKEN"])
local_repo = Git.open(build_dir)
local_tag = local_repo.tag(release_tag_name)

puts "Creating release for tag #{release_tag_name}..."
puts local_tag.message

release = client.create_release(repo_slug, release_tag_name, :name => release_tag_name, :body => local_tag.message, :prerelease => is_prerelease)

puts "Uploading release assets..."

asset_paths.each do |path|
  client.upload_asset(release[:url], path, :content_type => "application/javascript", :name => File.basename(path))
end

puts "Publishing #{version}..."

if is_prerelease
  system Shellwords.join(["npm", "publish", "--tag", "next", build_dir])
else
  system Shellwords.join(["npm", "publish", build_dir])
end
